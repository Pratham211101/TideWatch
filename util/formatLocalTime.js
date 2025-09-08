import moment from "moment";

export default function formatLocalTime (utcTime) {

    const formattedTime = moment(utcTime).local().format('Do MMMM YYYY, h:mm a')
    
    return formattedTime
}