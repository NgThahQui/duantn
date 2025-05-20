const express = require('express');
const router = express.Router();
const productController = require('../controllers/c_product')


// http://localhost:8989/product
router.get('/',async(req,res)=>{
    try{
        const product = await productController.getAll();
        res.status(200).json({status: 1, data: product});
    }catch(error){
        res.status(400).json({status: 0, data: error.message});
    }
})


// http://localhost:8989/product/hot
router.get('/hot',async(req,res)=>{
    try{
        const product = await productController.getHot();
        res.status(200).json({status: 1, data: product});
    }catch(error){
        res.status(400).json({status: 0, data: error.message});
    }
})


// http://localhost:8989/product/new
router.get('/new',async(req,res)=>{
    try{
        const product = await productController.getNew();
        res.status(200).json({status: 1, data: product});
    }catch(error){
        res.status(400).json({status: 0, data: error.message});
    }
})

// http://localhost:8989/product/sale
router.get('/sale',async(req,res)=>{
    try{
        const product = await productController.getSale();
        res.status(200).json({status: 1, data: product});
    }catch(error){
        res.status(400).json({status: 0, data: error.message});
    }
})


// http://localhost:8989/product/addPro
// dữ liệu mẫu thêm vào
// {
//     "status": 1,
//     "data": {
//         "name": "san pham test",
//         "id_category": "67f8b550cde96d99ff819116",
//         "image": "hinh",
//         "product_hot": 1,
//         "product_new": 1,
//         "sale": 10,
//         "status": 0,
//         "description": "abcabc",
//         "price": 2500000,
//         "_id": "67f8b8ba7607ec1ce588d707",
//         "__v": 0
//     }
// }
router.post('/addPro', async (req, res) => {
    try {
      const { name, id_category, image, product_hot, product_new, sale, status, description, price } = req.body;
      console.log(id_category);
  
      // Truyền một đối tượng chứa tất cả thông tin vào AddPro
      const product = await productController.AddPro(name,id_category,image,product_hot,product_new,sale,status,description,price);
  
      res.status(200).json({ status: 1, data: product });
    } catch (error) {
      res.status(400).json({ status: 0, data: error.message });
    }
  });


// http://localhost:8989/product/67f8b9ce6fcef9adf1bdc0e8/editPro
// dữ liệu mẫu thêm vào
// {
//     "name": "san pham moi sua",
//     "id_category": "67f8b550cde96d99ff819116",
//     "image": "hinh",
//     "product_hot": 1,
//     "product_new": 1,
//     "sale": 10,
//     "status": 0,
//     "description": "abcabc",
//     "price": 2500000
//   }
router.put('/:id/editPro', async (req, res) => {
    try { 
      const {id} = req.params;
      const { name, id_category, image, product_hot, product_new, sale, status, description, price } = req.body;

      const product = await productController.EditPro(id, name, id_category, image, product_hot, product_new, sale, status, description, price );
  
      res.status(200).json({ status: 1, data: product });
    } catch (error) {
      res.status(400).json({ status: 0, data: error.message });
    }
  });
module.exports = router;