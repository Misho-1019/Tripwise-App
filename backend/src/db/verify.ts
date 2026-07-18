import pool from "./pool"

async function verify() {
  const cats = await pool.query("SELECT count(*)::int as c FROM categories")
  const dests = await pool.query("SELECT count(*)::int as c FROM destinations")
  const attrs = await pool.query("SELECT count(*)::int as c FROM attractions")
  const hotels = await pool.query("SELECT count(*)::int as c FROM hotels")

  console.log("Categories:", cats.rows[0].c)
  console.log("Destinations:", dests.rows[0].c)
  console.log("Attractions:", attrs.rows[0].c)
  console.log("Hotels:", hotels.rows[0].c)

  const sample = await pool.query("SELECT name, country, rating FROM destinations ORDER BY rating DESC LIMIT 5")
  console.log("\nTop 5 destinations:")
  sample.rows.forEach((d: any) => console.log(`  - ${d.name} (${d.country}) rating: ${d.rating}`))

  await pool.end()
}

verify().catch(console.error)
