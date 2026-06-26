import axios from "axios"

// const API_URL = "http://localhost:5000/api/v2";
const API_URL= "import.meta.env.VITE_API_URL"

//upload single image

export const uploadSingleImage = async(file)=>{
    const formData = new FormData();
    formData.append("image", file)

    const response = await axios.post(`${API_URL}/upload/single`,  formData,{
        headers:{"Content-Type": "multipart/form-data"}
    })

    return response.data;
}

//upload multiple image

export const UploadMultipleImage = async(files)=>{
    const formData = new FormData();

    for (const file of files){
        formData.append("images",file);
    }

  

    const response = await axios.post(`${API_URL}/upload/multiple`,  formData,{
        headers:{"Content-Type": "multipart/form-data"}
    })

    return response.data;
}

//  get all images

export const getAllImage = async()=>{
    

    const response = await axios.get(`${API_URL}/images`);
    return response.data;
}

//Delete images

export const deleteImage = async(id)=>{
    

    const response = await axios.delete(`${API_URL}/image/${id}`);
    return response.data;
}


