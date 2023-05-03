const GOVERNORATES_CODES_MAP = {
    1: "Cairo",
    2: "Alexandria",
    3: "Port Said",
    4: "Suez",
    11: "Damietta",
    12: "Al Daqhlia",
    13: "Al Sharkia",
    14: "Al Qaliobia",
    15: "Kafr Alsheekh",
    16: "Al Gharbia",
    17: "Al Monuefia",
    18: "Al Bohira",
    19: "Al Ismaellia",
    21: "Al Giza",
    22: "Beni Suief",
    23: "Al Fayoum",
    24: "Al minia",
    25: "Assyout",
    26: "Suhag",
    27: "Quena",
    28: "Aswan",
    29: "Luxor",
    31: "AlBahr AlAhmar",
    32: "AlWadi AlJadid",
    33: "Matrooh",
    34: "North Sinai",
    35: "South Sinai",
    88: "Outside Egypt",
}


export function validateNID(NID) {

    if (!/^\d{14}$/.test(NID)) {
        return false;
    }

    let century = parseInt(NID.charAt(0));
    let year = parseInt(NID.substring(1, 3));
    let month = parseInt(NID.substring(3, 5));
    let day = parseInt(NID.substring(5, 7));
    let governorate = parseInt(NID.substring(7, 9));
    let unique_num = parseInt(NID.substring(9, 13));
    let verification_digit = parseInt(NID.charAt(13));

    let current_datetime = new Date();

    let centuryCheck = (century == 2 || century == 3)

    let yearCheck = (century === 3) ? (year <= current_datetime.getFullYear() - 2000) : true;

    let monthCheck = (month >= 1 && month <= 12);


    let dayCheck;
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        dayCheck = (day >= 1 && day <= 31);
    } else if ([4, 6, 9, 11].includes(month)) {
        dayCheck = (day >= 1 && day <= 30);
    } else if (month === 2) {
        if (year % 4 === 0) {
            dayCheck = (day >= 1 && day <= 29);
        } else {
            dayCheck = (day >= 1 && day <= 28);
        }
    } else {
        dayCheck = false;
    }

    let governorateCheck = governorate in GOVERNORATES_CODES_MAP;
    if (centuryCheck && yearCheck && monthCheck && dayCheck && governorateCheck) return true
    else return false;

}


export function get_info(NID) {
    if (validateNID(NID)) {
        let id_owner_data = {};


        id_owner_data["year_of_birth"] = (century === 3) ? `20${year}` : `19${year}`;
        id_owner_data["month_of_birth"] = `${month}`;
        id_owner_data["day_of_birth"] = `${day}`;
        id_owner_data["governorate"] = GOVERNORATES_CODES_MAP[governorate];
        id_owner_data["type"] = (unique_num % 2 !== 0) ? "Male" : "Female";
        return [true, id_owner_data];
    } else {
        let number_error_msg = `Invalid national ID number: ${NID}. Please enter the correct one`;
        return [false, { "error": number_error_msg }];
    }

}