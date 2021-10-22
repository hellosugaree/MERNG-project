const User = require('../../models/User');

module.exports = {
  extendProfilePhoto: async (collection, userIdKey) => {
    const defaultProfilePhoto = JSON.stringify({ secure_url: '/img/icons/small/Calico-Bass-Small.png' });
    const withProfilePhoto = await Promise.all(collection.map(async (document) => {
      const userId = document[userIdKey];
      const userFound = await User.findOne({ _id: userId }, { profilePhoto: 1 });
      document.profilePhoto = userFound.profilePhoto ? userFound.profilePhoto : defaultProfilePhoto;
      return document;
    }));
    return withProfilePhoto;
  },
};