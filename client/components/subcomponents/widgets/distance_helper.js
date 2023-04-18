export const distanceBetween = (lat_0, lng_0, lat_1, lng_1) => {

    var p = 0.017453292519943295;    
    var c = Math.cos;
    var a = 0.5 - c((lat_0 - lat_1) * p)/2 + 
        c(lat_1 * p) * c(lat_0 * p) * 
        (1 - c((lng_0 - lng_1) * p))/2;  
    var distance = Math.ceil(12742 * Math.asin(Math.sqrt(a)) * 10)/10;

    return distance;
}
    