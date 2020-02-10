import Sequelize from 'sequelize';

export default class Cards extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        account_id: DataTypes.STRING,
        card_network: DataTypes.STRING,
        card_type: DataTypes.STRING,
        currency: DataTypes.STRING,
        partial_card_number: DataTypes.STRING,
        display_name: DataTypes.STRING,
        provider: DataTypes.STRING,
      },
      { sequelize },
    );
  }

  static associate(models) {
    this.userAssociation = this.belongsTo(models.Users);
    this.transactionAssociation = this.hasMany(models.Transactions);
  }
}
