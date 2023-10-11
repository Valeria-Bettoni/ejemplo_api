async function list (tabla, res) {
    try {
        let tuplas = await tabla.findAll()
        res.status(200).json(tuplas)
    } catch (error) {
        console.log(error)
        res.status(204).json({"messagge" : error})
    }
}
export default list