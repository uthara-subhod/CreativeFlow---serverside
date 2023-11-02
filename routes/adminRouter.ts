
import { login } from "../controllers/admin/authController"
import { edit, users } from "../controllers/admin/moderators/userController"
import { Router } from "express"
import { verifyAdmin } from "../utility/jwt"
import { addGenre, deleteGenre, editGenre, genre, genres } from "../controllers/admin/genreController"
import { addArtField, artField, artFields, deleteArtField, editArtField } from "../controllers/admin/artFieldController"
import { createMod, deleteMod, editAccess, getMod, getMods } from "../controllers/admin/moderatorController"
import { addService, deleteService, editService, provider, service, services } from "../controllers/admin/serviceController"
import { providers } from "../controllers/admin/serviceController"
import { pay, seller, transactions } from "../controllers/admin/transactionController"

const router = Router()

router.use(verifyAdmin)

router.post('/login',login)

router.get('/users',users)
router.get('/users/:id/edit',edit)

router.get('/providers',providers)
router.post('/providers/:id/edit',provider)



router.get('/genres', genres)
router.post('/genres/add',addGenre)
router.get('/genres/:genre',genre)
router.post('/genres/:genre',editGenre)
router.delete('/genres/:genre',deleteGenre)

router.get('/artfields',artFields)
router.post('/artfields/add',addArtField)
router.get('/artfields/:field',artField)
router.post('/artfields/:field',editArtField)
router.delete('/artfields/:field',deleteArtField)

router.get('/services',services)
router.post('/services/add',addService)
router.get('/services/:service',service)
router.post('/services/:service',editService)
router.delete('/services/:service',deleteService)

router.get('/transactions',transactions)
router.get('/transactions/seller/:id',seller)
router.get('/transactions/:id',pay)

router.get('/moderators',getMods)
router.post('/moderators',createMod)
router.get('/moderators/mod_id',getMod)
router.post('/moderators/mod_id',editAccess)
router.delete('/moderators/mod_id',deleteMod)



export default router

