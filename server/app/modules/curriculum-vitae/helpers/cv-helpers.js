import CvService from "../services";

export const TEST_CV_DATA = {
    userHash: 'user-hash',
    title: 'Android developer',
    description: 'Mobile development',
    tags: ['java', 'kotlin'],
};

/**
 * Function for creation of CV
 */
export async function createTestCV(cvData = TEST_CV_DATA) {
    return await CvService.createCv(cvData);
}

/**
 * Function for creation of the list of test CVs
 */
export async function createTestCvList(cvCount, cvData = TEST_CV_DATA) {
    for (let i = 0; i < cvCount; i++) {
        await createTestCV(cvData);
    }
}

/**
 * Function for creation of the list of CVs for each item of the cvDataArray
 */
export async function createTestCvFromDataArray(cvDataArray) {
    for (let i = 0; i < cvDataArray.length; i++) {
        await createTestCV(cvDataArray[i]);
    }
}