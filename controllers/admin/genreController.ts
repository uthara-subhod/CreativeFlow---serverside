import CategoryRepository from "../../repositories/CategoryRepository"

export const addGenre = async (req, res) => {
    try {
        const data = req.body;
        const exist = await CategoryRepository.findGenreByName(data.name)
        if (exist) {
            res.status(409).json({ msg: "Genre already exists!" })
        } else {
            const genre = await CategoryRepository.addGenre(data)
            if (genre) {
                res.status(200).json({ msg: "Added" })
            } else {
                res.status(500).json({ msg: "Error creating genre" })
            }

        }
    } catch (err) {
        res.status(500).json({ msg: "Error creating genre" })
    }
}

export const genre = async (req, res) => {
    try {
        const id = req.params.genre
        const genre = await CategoryRepository.findGenreById(id)
        if (genre) {
            res.status(200).json({ item: genre })
        } else {
            res.status(404).json({ msg: "No such Genre" })
        }
    } catch (err) {
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const genres = async (req, res) => {
    try {
        const genres = await CategoryRepository.genres()
        if (genres) {
            res.status(200).json({ data: genres })
        } else {
            res.status(500).json({ msg: "Error fetching data" })
        }

    } catch (err) {
        res.status(500).json({ msg: "Error fetching data" })
    }
}

export const editGenre = async (req, res) => {
    try {
        const { name, cover } = req.body;
        const id = req.params.genre
        const exist = await CategoryRepository.findGenreByName(name)
        if(exist?.cat_id!=id){
            res.status(500).json({ msg: "genre already exist" })
        }
        const genre = await CategoryRepository.updateGenre(id, name, cover)
        if (genre) {
            res.status(200).json({ msg: "Edited" })
        } else {
            res.status(500).json({ msg: "Error updating genre" })
        }



    } catch (err) {
        res.status(500).json({ msg: "Error updating genre" })
    }
}

export const deleteGenre = async (req, res) => {
    try {
        const id = req.params.genre
        const genre = await CategoryRepository.findGenreById(id)
        if (genre) {
            if (genre.items.length == 0) {
                const deleted = await CategoryRepository.deleteGenre(id)
                if (deleted) {
                    res.json(200).json({ msg: "Deleted" })
                } else[
                    res.status(500).json({ msg: "Error deleting genre" })
                ]
            } else {
                res.status(409).json({ msg: "Genre is not Empty!" })
            }
        } else {
            res.status(404).json({ msg: "No such Genre" })
        }
    } catch (err) {
        res.status(500).json({ msg: "Internal server error" })
    }
}

