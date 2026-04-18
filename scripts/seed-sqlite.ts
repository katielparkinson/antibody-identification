import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import initSqlJs from "sql.js";
import { antibodies, antigens } from "../src/lib/antibodyPolicy";
import { practiceCases } from "../src/lib/practiceCases";

const databasePath = path.join(process.cwd(), "data", "antibody-identification.sqlite");
const schemaPath = path.join(process.cwd(), "data", "schema.sql");

const dbValue = (value: string | number | boolean) => {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  return value;
};

const main = async () => {
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  const schema = await readFile(schemaPath, "utf8");

  db.run(schema);

  const insertAntigen = db.prepare(
    "INSERT INTO antigens (id, label, blood_group_system, display_order) VALUES (?, ?, ?, ?)",
  );
  for (const antigen of antigens) {
    insertAntigen.run([antigen.id, antigen.label, antigen.system, antigen.displayOrder]);
  }
  insertAntigen.free();

  const insertAntibody = db.prepare(
    "INSERT INTO antibodies (id, label, antigen_id, dosage_sensitive, display_order) VALUES (?, ?, ?, ?, ?)",
  );
  for (const antibody of antibodies) {
    insertAntibody.run([
      antibody.id,
      antibody.label,
      antibody.antigenId,
      dbValue(antibody.dosageSensitive),
      antibody.displayOrder,
    ]);
  }
  insertAntibody.free();

  const insertCase = db.prepare("INSERT INTO practice_cases (id, title, summary) VALUES (?, ?, ?)");
  const insertCell = db.prepare(
    "INSERT INTO donor_cells (id, practice_case_id, label, is_auto_control) VALUES (?, ?, ?, ?)",
  );
  const insertCellAntigen = db.prepare(
    "INSERT INTO donor_cell_antigens (donor_cell_id, antigen_id, antigen_value, zygosity) VALUES (?, ?, ?, ?)",
  );
  const insertReaction = db.prepare(
    "INSERT INTO case_reactions (practice_case_id, donor_cell_id, reaction_value) VALUES (?, ?, ?)",
  );
  const insertAnswer = db.prepare("INSERT INTO case_answers (practice_case_id, antibody_id) VALUES (?, ?)");

  for (const practiceCase of practiceCases) {
    insertCase.run([practiceCase.id, practiceCase.title, practiceCase.summary]);

    for (const cell of practiceCase.cells) {
      insertCell.run([cell.id, practiceCase.id, cell.label, dbValue(Boolean(cell.isAutoControl))]);
      insertReaction.run([practiceCase.id, cell.id, practiceCase.reactions[cell.id]]);

      for (const antigen of antigens) {
        insertCellAntigen.run([
          cell.id,
          antigen.id,
          cell.antigens[antigen.id],
          cell.zygosity[antigen.id],
        ]);
      }
    }

    for (const antibodyId of practiceCase.targetAntibodies) {
      insertAnswer.run([practiceCase.id, antibodyId]);
    }
  }

  insertCase.free();
  insertCell.free();
  insertCellAntigen.free();
  insertReaction.free();
  insertAnswer.free();

  const output = db.export();
  db.close();

  await mkdir(path.dirname(databasePath), { recursive: true });
  await writeFile(databasePath, output);

  console.log(`Seeded SQLite database at ${databasePath}`);
};

await main();
