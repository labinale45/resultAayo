router.get("/records/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const { status, includeUser } = req.query;

    const query = `
      SELECT 
        t.*,
        u.email as user_email,
        u.id as user_id
      FROM teachers t
      LEFT JOIN users u ON t.id = u.teacher_id
      WHERE t.year = ? AND t.status = ?
    `;

    const [rows] = await pool.execute(query, [year, status]);

    // Transform the data to include user information in a nested object
    const teachers = rows.map(row => ({
      ...row,
      user: row.user_id ? {
        id: row.user_id,
        email: row.user_email
      } : null
    }));

    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
}); 