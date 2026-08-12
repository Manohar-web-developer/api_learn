async function generateUniqueSlug(Model, slug, currentId = null) {

  let newSlug = slug;
  let count = 1;

  while (true) {

      let query = {
          slug: newSlug,
          delete_at: null
      };

      if (currentId) {
          query._id = { $ne: currentId };
      }

      const existing = await Model.findOne(query);

      if (!existing) {
          return newSlug;
      }

      newSlug = `${slug}-${count}`;
      count++;
  }
}
module.exports = { generateUniqueSlug }