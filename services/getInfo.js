async function getInfo (table, key, option, res){
    try {
        let item = await table.findByPk(key)

        if (!item) {
            res.status(204).json({"message": "Item npt found"})
        }

        res.status(200).json(item[option])
    } catch (error) {
        res.status(204).json({"message": error})
    }
}
export default getInfo;