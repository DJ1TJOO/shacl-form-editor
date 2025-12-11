import { readFile, writeFile, readdir } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { buildParserFile } from '@lezer/generator'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function buildGrammar() {
  const files = await readdir(__dirname)

  try {
    for (const fileName of files) {
      const matches = /^([^\0].*\.grammar)(\.terms)?$/.exec(fileName)
      if (!matches) continue

      const base = matches[1]
      const code = await readFile(resolve(__dirname, base), 'utf8')

      const result = await buildParserFile(code, {
        fileName: base,
        moduleStyle: 'es',
        exportName: 'parser',
        warn: (message) => console.warn(message),
      })

      const generatedCode = matches[2] ? result.terms : result.parser
      await writeFile(resolve(__dirname, '..', 'generated', `${base}.ts`), generatedCode, 'utf8')
    }

    console.log(`✓ Generated`)
  } catch (error) {
    console.error('Error building grammar:', error)
    process.exit(1)
  }
}

buildGrammar()
