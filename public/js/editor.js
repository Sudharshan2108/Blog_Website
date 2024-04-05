const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');

// banner
const BannerImage = document.querySelector('#Banner-upload');
const Banner = document.querySelector(".Banner");
let BannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

BannerImage.addEventListener('change', () => {
    uploadImage(BannerImage, "Banner");
})

uploadInput.addEventListener('change',() =>{
    uploadImage(uploadInput, "image");

})



const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image"){
                addImage(data,file.name);

            }
            else{
                BannerPath = `${location.origin}/${data}`;
                Banner.style.backgroundImage = `url("${BannerPath}")`;

            }
            })
        }else{
            alert("Upload Image Only");
        }
}
const addImage =(imagepath,alt) => {
    let curPos= articleField.selectionStart;
    let textToInsert=`\r![${alt}](${imagepath})\r`;
    articleField.value=articleField.value.slice(0,curPos)+ textToInsert +articleField.value.slice(curPos);

}
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


publishBtn.addEventListener('click', () => {
    if(articleField.value.length && blogTitleField.value.length){
        // generating id
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for(let i = 0; i < 4; i++){
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        // setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // for published at info

        //access firstore with db variable;
        db.collection("Blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleField.value,
            BannerImage: BannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        })
        .then(() => {
            location.href = `/${docName}`;
        })
        .catch((err) => {
            console.error(err);
        })
    }
})