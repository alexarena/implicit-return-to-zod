import * as typescript from "typescript";
import { writeFile } from "fs/promises";
import { generate as generateZod } from "ts-to-zod";
import path from "path";

/*
    1. compile TS -> d.ts
    2. extract return type
    3. generate zod schema
*/

const demoFileName = "test-file.ts";

const demoDir = path.join(process.cwd(), "demo");

function extractReturnType(rootDir: string, fileName: string) {
  const filePath = path.join(rootDir, fileName);

  const host = typescript.createCompilerHost({});

  const program = typescript.createProgram(
    [filePath],
    {
      declaration: true,
      emitDeclarationOnly: true,
    },
    host
  );

  const sourceFile = program.getSourceFile(filePath);

  const checker = program.getTypeChecker();

  let typeAsString: string | null = null;
  typescript.forEachChild(sourceFile!, (node) => {
    if (
      typescript.isFunctionDeclaration(node) &&
      node.name?.getText() === "fetchCardInfo" // hardcoded for now
    ) {
      const signature = checker.getSignatureFromDeclaration(node);
      const returnType = checker.getReturnTypeOfSignature(signature!);

      typeAsString = checker.typeToString(returnType, undefined, 1);
    }
  });

  if (!typeAsString) {
    throw new Error(`Expected type string for ${fileName}`);
  }
  return typeAsString;
}

function generateZodSchema(typeDef: string) {
  return generateZod({ sourceText: typeDef }).getZodSchemasFile("");
}

const returnType = extractReturnType(path.join(demoDir, "src"), demoFileName);

const typeDef = `export type Result = ${returnType}`;

const zodSchemaFile = generateZodSchema(typeDef);

await writeFile(
  path.join(demoDir, "out", demoFileName.replace(".ts", ".zod.ts")),
  zodSchemaFile
);
