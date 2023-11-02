import CategoryRepository from "../../repositories/CategoryRepository"

export const addArtField = async (req, res) => {
    try {
        const data = req.body;
        const exist = await CategoryRepository.findArtFieldByName(data.name)
        if (exist) {
            res.status(409).json({ msg: "ArtField already exists!" })
        } else {
            const artField = await CategoryRepository.addArtField(data)
            if (artField) {
                res.status(200).json({ msg: "Added" })
            } else {
                res.status(500).json({ msg: "Error creating ArtField" })
            }

        }
    } catch (err) {
        res.status(500).json({ msg: "Error creating ArtField" })
    }
}

export const artField = async (req, res) => {
    try {
        const id = req.params.field
        const artField = await CategoryRepository.findArtFieldById(id)
        if (artField) {
            res.status(200).json({item:artField})
        } else {
            res.status(404).json({ msg: "No such ArtField" })
        }
    } catch (err) {
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const artFields = async (req, res) => {
    try {
        const artFields = await CategoryRepository.artfields()
        if (artFields) {
            res.status(200).json({data:artFields})
        } else {
            res.status(500).json({ msg: "Error fetching data" })
        }

    } catch (err) {
        res.status(500).json({ msg: "Error fetching data" })
    }
}

export const editArtField = async (req, res) => {
    try {
        const {name,cover} = req.body;
        const id=req.params.field
        const exist = await CategoryRepository.findArtFieldByName(name)
        if (exist?.cat_id!=id) {
            res.status(409).json({ msg: "ArtField already exists!" })
        } else {
            const artField = await CategoryRepository.updateArtField(id,name,cover)
            if (artField) {
                res.status(200).json({ msg: "Edited" })
            } else {
                res.status(500).json({ msg: "Error updating ArtField" })
            }

        }

    } catch (err) {
        res.status(500).json({ msg: "Error updating ArtField" })
    }
}

export const deleteArtField = async (req, res) => {
    try {
        const id = req.params.field
        const artField = await CategoryRepository.findArtFieldById(id)
        if(artField){
            if (artField.items.length==0) {
                const deleted = await CategoryRepository.deleteArtField(id)
                if(deleted){
                    res.json(200).json({ msg: "Deleted" })
                }else[
                    res.status(500).json({ msg: "Error deleting ArtField" })
                ]
            } else {
                res.status(409).json({ msg: "ArtField is not Empty!" })
            }
        }else{
            res.status(404).json({ msg: "No such ArtField" })
        }
    } catch (err) {
        res.status(500).json({ msg: "Internal server error" })
    }
}
