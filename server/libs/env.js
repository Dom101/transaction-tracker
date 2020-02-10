export default {
  get(key, defaultValue) {
    const value = process.env[key];

    if (value == null) {
      return defaultValue;
    }

    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  },
};
