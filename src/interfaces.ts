export interface IInterview {
    id: string,
    company: string,
    vacancyLink: string,
    hrName: string,
    contactTelegram?: string,
    contactWhatsApp?: string,
    contactPhone?: string,
    createdAt: Date,
    salaryFrom?: number,
    salaryTo?: number,
    stages?: IStage,
    result?: 'Refusal' | 'Offer',
}


export interface IStage{
    stageName?: string,
    stageCalendar?: null | Date,
    stageComments?:  string,
}