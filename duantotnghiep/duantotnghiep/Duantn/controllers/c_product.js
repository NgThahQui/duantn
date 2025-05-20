const productModel = require ('../models/m_product');
const categoryModel = require ('../models/m_category');
const mongoose = require('mongoose');
const getAll = async() => {
    try{
        const products = await productModel
                .find();
        if (products.length == 0 ) {
            throw new Error('Không có dữ liệu');
        }
        return products;        
    }catch (error) {
        console.log(' get product error:' + error);
        throw new Error('lỗi lấy dữ liệu');
    }
}

const getHot = async() => {
    try{
        const products = await productModel
                .find({product_hot: 1});
        if (products.length == 0 ) {
            throw new Error('Không có dữ liệu');
        }
        return products;        
    }catch (error) {
        console.log(' get product hot error:' + error);
        throw new Error('lỗi lấy dữ liệu');
    }
}

const getNew = async() => {
    try{
        const products = await productModel
                .find({product_new: 1});
        if (products.length == 0 ) {
            throw new Error('Không có dữ liệu');
        }
        return products;        
    }catch (error) {
        console.log(' get product new error:' + error);
        throw new Error('lỗi lấy dữ liệu');
    }
}

const getSale = async() => {
    try{
        let query = {};
        query.sale = {$gt: 0};
        const products = await productModel
                .find(query);
        if (products.length == 0 ) {
            throw new Error('Không có dữ liệu');
        }
        return products;        
    }catch (error) {
        console.log(' get product new error:' + error);
        throw new Error('lỗi lấy dữ liệu');
    }
}

const AddPro = async (name,id_category,image,product_hot,product_new,sale,status,description,price) => {
    try {
  
      // Chuyển id_category thành ObjectId
      const categoryObjectId = new mongoose.Types.ObjectId(id_category);
      console.log(id_category);
  
      // Kiểm tra xem category có tồn tại không
      const categoryInDB = await categoryModel.findById(categoryObjectId);
      if (!categoryInDB) {
        throw new Error('Không có category');
      }
  
      // Tạo đối tượng product
      const product = {
        name,
        id_category: categoryObjectId,
        image,
        product_hot,
        product_new,
        sale,
        status,
        description,
        price
      };
  
      // Lưu sản phẩm vào database
      const newProduct = new productModel(product);
      const result = await newProduct.save();
      return result;
    } catch (error) {
      console.log('AddPro error:', error.message);
      throw new Error(error.message);
    }
  };

  const EditPro = async (_id, name, id_category, image, product_hot, product_new, sale, status, description, price) => {
    try {
        // Kiểm tra xem sản phẩm có tồn tại trong DB không
        const productInDB = await productModel.findById(_id);
        if (!productInDB) {
            throw new Error(`Không tồn tại sản phẩm có id=${_id}`);
        }

        // Chuyển id_category thành ObjectId
        const categoryObjectId = new mongoose.Types.ObjectId(id_category);

        // Kiểm tra xem category có tồn tại không
        const categoryInDB = await categoryModel.findById(categoryObjectId);
        if (!categoryInDB) {
            throw new Error('Không có category');
        }

        // Cập nhật các trường trong sản phẩm
        productInDB.name = name || productInDB.name;
        productInDB.image = image || productInDB.image;
        productInDB.product_hot = product_hot || productInDB.product_hot;
        productInDB.product_new = product_new || productInDB.product_new;
        productInDB.sale = sale || productInDB.sale;
        productInDB.status = status || productInDB.status;
        productInDB.description = description || productInDB.description;
        productInDB.price = price || productInDB.price;
        productInDB.id_category = categoryObjectId || productInDB.id_category;

        // Lưu sản phẩm đã được cập nhật vào database
        const updatedProduct = await productInDB.save();

        return updatedProduct;
    } catch (error) {
        console.log('EditPro error:', error.message);
        throw new Error(error.message);
    }
};

module.exports = {getAll,getHot,getNew,getSale,AddPro,EditPro};