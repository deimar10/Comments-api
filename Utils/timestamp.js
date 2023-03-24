 function getTimeStamp() {
        const currentDate = new Date().toISOString();
        let dateObject = new Date(currentDate);

        let dateDay = dateObject.getDate();
        let dateMonth = dateObject.getMonth() + 1;
        let time = dateObject.getHours().toString().padStart(2,0) + ":" + dateObject.getMinutes().toString().padStart(2,0) + ":" + dateObject.getSeconds().toString().padStart(2,0);
        const timeStamp = dateDay + "/" + dateMonth  + " " + time;

        return timeStamp;
};

module.exports = { getTimeStamp }