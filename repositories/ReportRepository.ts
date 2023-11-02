import Report from "../models/Report";

class ReportRepostory {
    async create(data:any){
        return Report.create(data);
    }

    async editReport(data:any, report_id:string){
        return Report.findOneAndUpdate({report_id:report_id},{$set:data},{new:true})
    }

    async findReport(data:any){
        delete data.violation
        delete data.description
        delete data.links
        return Report.findOne(data)
    }

    async getReports(){
        return Report.find().populate({path:'book_id'}).populate({path:'chapter_id'})
        .populate({path:'artwork_id'}).populate({path:'provider_id'}).populate({path:'user_id'}).populate({path:'reporter'})
    }

    async getReport(report_id:string){
        return Report.findOneAndUpdate({report_id:report_id}).populate({path:'book_id'}).populate({path:'chapter_id'})
        .populate({path:'artwork_id'}).populate({path:'provider_id'}).populate({path:'user_id'}).populate({path:'reporter'})
    
    }
}

export default new ReportRepostory()