// const ProductDetail = require('../Models/ProductDetail');

// exports.getProductDetail = async (req, res) => {
//   try {
//     const detail = await ProductDetail.findOne({ productId: req.params.id });
//     if (!detail) return res.status(404).json({ message: 'No detailed info found' });
//     res.status(200).json(detail);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error', detail: err.message });
//   }
// };
