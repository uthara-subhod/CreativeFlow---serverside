import ArtworkRepository from "../../../repositories/ArtworkRepository"
import BookRepository from "../../../repositories/BookRepository"
import ReportRepository from "../../../repositories/ReportRepository"

export const getReports = async (req,res)=>{
    try{
        const reports = await ReportRepository.getReports()
        res.status(200).json({reports:reports})
    }catch(err:any){
        res.status(500).json({msg:"Server error"})
    }
}

export const getReport = async (req,res)=>{
    try{
        const report_id=req.params.report_id
        const report:any = await ReportRepository.getReport(report_id)
        if(report){
            res.status(200).json({report:report})
        }else{
            res.status(404).json({msg:"Report not found"})
        }
    }catch(err:any){
        res.status(500).json({msg:"Server error"})
    }
}

export const resolve = async (req,res)=>{
    try{
        const report_id=req.params.report_id
        const data=req.body
        const report:any = await ReportRepository.getReport(report_id)
        let item:any
        const r = await ReportRepository.editReport(data,report_id)
        console.log(r)
        
            if(report){
                if(data.action=='reject'){
                    res.status(200).json({msg:"SUCEESS"})
                }else{
                if(report.item=='book'){
                    if (data.action=='warn'){
                        item = await BookRepository.addWarning('book',report?.book_id)
                    }else if(data.action=='unpublish'){
                        item = await BookRepository.unpublishBook(report.book_id.book_id,report.book_id._id)
                    }
                }else if (report.item=='chapter'){
                    if (data.action=='warn'){
                        item = await BookRepository.addWarning('chapter',report?.chapter_id)
                    }else if(data.action=='unpublish'){
                        item = await BookRepository.unChapter(report.chapter_id)
                    }
                }else if(report.item=='artwork'){
                    if (data.action=='warn'){
                        item = await ArtworkRepository.addWarning(report.artwork_id)
                    }else if(data.action=='unpublish'){
                        item = await ArtworkRepository.unpublishArtWork(report.artwork_id)
                }
            }if(item){
                res.status(200).json({msg:"SUCEESS"})
            }else{
                res.status(400).json({msg:"Error"})
            }}
            
        }
    }catch(err:any){
        res.status(500).json({msg:"Server error"})
    }
}



