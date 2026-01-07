// Validation rule example for checking inputs
export function validateRow(req, res, next) {
  const { column1, column2, column3 } = req.body

  if (!column1 || column1.trim() === '') {
    return res.status(400).json({ error: 'Column1 is required' })
  }

  if (!column2 || column2.trim() === '') {
    return res.status(400).json({ error: 'Column2 is required' })
  }

  if (!column3 || column3.trim() === '') {
    return res.status(400).json({ error: 'Column3 is required' })
  }

  next()
}
