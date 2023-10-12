async function update (req, table, key, res){
    try {
        let itemToUpdate = await table.findByPk(key)

        if (!itemToUpdate) {
            return res.status(204).json({"mensage":"Item not found"})
        }

        await itemToUpdate.update(req.body)
        res.status(200).send('Update successful')
        
    } catch (error) {
        res.status(204).json({"message": error})
    }
}
export default update;