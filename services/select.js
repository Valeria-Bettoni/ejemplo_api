async function select (table, key, res) {
    try {
        let tupla = await table.findByPk(key)
        if (tupla){
            return res.status(200).json(tupla)
        }
        res.status(204).json({"message":"Not found"})

    } catch (error) {
        res.status(204).json({"message": error})
    }
}
export default select