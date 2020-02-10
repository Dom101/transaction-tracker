import Sequelize from 'sequelize';

export default class Users extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: DataTypes.STRING,
      },
      { sequelize },
    );
  }

  static associate(models) {
    this.accountAssociation = this.hasMany(models.Accounts);
  }
}
