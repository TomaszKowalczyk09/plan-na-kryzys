import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const input = path.join(root, 'public', 'logo.svg')
const outDir = path.join(root, 'public', 'icons')

if (!fs.existsSync(input)) {
  console.error(`Missing input: ${input}`)
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })

const sizes = [192, 512]
await Promise.all(
  sizes.map(async (s) => {
    const outFile = path.join(outDir, `icon-${s}.png`)
    await sharp(input)
      .resize(s, s, {
        fit: 'contain',
        background: { r: 11, g: 18, b: 32, alpha: 1 },
      })
      .png()
      .toFile(outFile)
    console.log(`Generated: ${outFile}`)
  }),
)
