import fs from 'fs'
import path from 'path'

export default (req, res) => {
  res.status(200).json(JSON.parse(fs.readFileSync(`${process.cwd()}/public/schedule.json`, 'utf8')))
}