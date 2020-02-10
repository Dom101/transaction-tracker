import Sequelize from 'sequelize';

export default class Accounts extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        account_id: DataTypes.STRING,
        display_name: DataTypes.STRING,
        provider: DataTypes.STRING,
        account_type: DataTypes.STRING,
        currency: DataTypes.STRING,
        account_number: DataTypes.STRING,
        account_iban: DataTypes.STRING,
        account_sort_code: DataTypes.STRING,
      },
      { sequelize },
    );
  }

  static associate(models) {
    this.userAssociation = this.belongsTo(models.Users);
    this.transactionAssociation = this.hasMany(models.Transactions);
  }
}
