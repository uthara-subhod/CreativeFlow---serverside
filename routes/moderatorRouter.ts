import { Router } from "express"
import { edit, users } from "../controllers/admin/moderators/userController"
import { getReport, getReports, resolve } from "../controllers/admin/moderators/reportController"

const router = Router()
 
router.get('/users',users)
router.get('/users/:id/edit',edit)
router.get('/reports',getReports)
router.get('/reports/:report_id', getReport)
router.post('/reports/:report_id',resolve)
export default router