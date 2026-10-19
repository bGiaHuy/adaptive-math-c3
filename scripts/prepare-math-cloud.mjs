import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomBytes,randomUUID} from 'node:crypto';

// Preparation only: execute the files explicitly against the verified empty project.
const project='turjtcqkmjfkhqijjpdz';
const root=process.cwd(), output=path.join(root,'.math-adaptive-qa',`cloud-${project}`);
fs.mkdirSync(output,{recursive:true});
const envPath=path.join(root,'.env.math-production.local');
if(fs.existsSync(envPath))throw new Error('Production credential file already exists; refusing to rotate credentials implicitly.');
const password=randomBytes(32).toString('hex');
fs.writeFileSync(envPath,`MATH_SUPABASE_PROJECT_REF=${project}\nMATH_DATABASE_USER=math_app\nMATH_DATABASE_PASSWORD=${password}\n`,{mode:0o600});
fs.writeFileSync(path.join(output,'00-schema.sql'),`BEGIN;
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema IN ('public','math') AND table_type='BASE TABLE') THEN
  RAISE EXCEPTION 'Expected an empty dedicated project';
 END IF;
END $$;
CREATE SCHEMA math;
REVOKE ALL ON SCHEMA math FROM PUBLIC, anon, authenticated;
SET LOCAL search_path TO math;
CREATE TABLE "_prisma_migrations" (
 id varchar(36) PRIMARY KEY, checksum varchar(64) NOT NULL,
 finished_at timestamptz, migration_name varchar(255) NOT NULL,
 logs text, rolled_back_at timestamptz, started_at timestamptz NOT NULL DEFAULT now(), applied_steps_count integer NOT NULL DEFAULT 0
);
COMMIT;
`);
const migrationRoot=path.join(root,'apps/api/prisma/migrations');
const folders=fs.readdirSync(migrationRoot).filter(folder=>fs.existsSync(path.join(migrationRoot,folder,'migration.sql'))).sort();
folders.forEach((folder,index)=>{
 const sql=fs.readFileSync(path.join(migrationRoot,folder,'migration.sql'),'utf8');
 const checksum=createHash('sha256').update(sql).digest('hex');
 fs.writeFileSync(path.join(output,`${String(index+1).padStart(2,'0')}-${folder}.sql`),`BEGIN;\nSET LOCAL search_path TO math;\n${sql}\nINSERT INTO "_prisma_migrations" (id,checksum,migration_name,finished_at,applied_steps_count) VALUES ('${randomUUID()}','${checksum}','${folder}',now(),1);\nCOMMIT;\n`);
});
fs.writeFileSync(path.join(output,'99-runtime.sql'),`BEGIN;
CREATE ROLE math_app LOGIN PASSWORD '${password}' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
GRANT CONNECT ON DATABASE postgres TO math_app;
GRANT USAGE ON SCHEMA math TO math_app;
ALTER ROLE math_app SET search_path TO math;
DO $$ DECLARE t record; BEGIN
 FOR t IN SELECT tablename FROM pg_tables WHERE schemaname='math' AND tablename <> '_prisma_migrations' LOOP
  EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE math.%I TO math_app',t.tablename);
  EXECUTE format('ALTER TABLE math.%I ENABLE ROW LEVEL SECURITY',t.tablename);
  EXECUTE format('CREATE POLICY math_backend_access ON math.%I TO math_app USING (true) WITH CHECK (true)',t.tablename);
 END LOOP;
END $$;
GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA math TO math_app;
REVOKE ALL ON ALL TABLES IN SCHEMA math FROM PUBLIC,anon,authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA math FROM PUBLIC,anon,authenticated;
COMMIT;
`);
console.log(`Prepared ${folders.length} migrations and isolated runtime permissions in ${path.relative(root,output)}. Credentials saved in an ignored local file; no credentials printed.`);
