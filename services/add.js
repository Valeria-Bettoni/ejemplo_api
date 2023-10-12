async function add (req, table, res) {
    try {
        console.log(req.body);
        const newItem = new table(req.body)
        await newItem.save()
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(500).json({"message": "error", "error": error.toString()})
    }
}
export default add