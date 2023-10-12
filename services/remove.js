async function remove(table, key, res) {
    try {
        let itemToEliminate = await table.findByPk(key)

        if (!itemToEliminate) {
            return res.status(204).json({"message": "Item not found"})
        }
        await itemToEliminate.destroy()
        res.status(200).json({"message": "Item eliminated successfully"})

    } catch (error) {
        res.status(208).json({"message": error})
    }
}
export default remove;