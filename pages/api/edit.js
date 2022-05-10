import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      fs.writeFileSync(`${process.cwd()}/public/schedule.json`, JSON.stringify(req.body))
      res.status(200)
    } catch(err) {
      res.status(500)
    }
  }
}