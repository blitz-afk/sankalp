import { User } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { ROLES } from '../utils/constants.js';

export const syncUser = async (req, res, next) => {
  try {
    const { email, displayName, photoURL, role, organization, phone } = req.body;
    const firebaseUid = req.firebaseUser.uid;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = new User({
        firebaseUid,
        email: email || req.firebaseUser.email,
        displayName: displayName || req.firebaseUser.name || '',
        photoURL: photoURL || req.firebaseUser.picture || '',
        role: role && Object.values(ROLES).includes(role) ? role : ROLES.CITIZEN,
        organization: organization || '',
        phone: phone || '',
      });
      await user.save();
    } else {
      // Update basic fields if provided
      if (displayName) user.displayName = displayName;
      if (photoURL) user.photoURL = photoURL;
      if (organization) user.organization = organization;
      if (phone) user.phone = phone;
      if (role && Object.values(ROLES).includes(role) && !user.role) {
        user.role = role;
      }
      await user.save();
    }

    return sendSuccess(res, 200, 'User profile synchronized successfully', user);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 404, 'User profile not found in database');
    }
    return sendSuccess(res, 200, 'User profile retrieved', req.user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    // Disallow overriding critical security fields directly
    delete updates.firebaseUid;
    delete updates.email;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    return sendSuccess(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};
