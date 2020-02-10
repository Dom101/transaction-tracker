import Sequelize from 'sequelize';

export default class Transactions extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        transaction_id: DataTypes.STRING,
        timestamp: DataTypes.DATE,
        description: DataTypes.STRING,
        transaction_type: DataTypes.STRING,
        transaction_category: DataTypes.STRING,
        amount: DataTypes.DECIMAL(10, 2),
        running_balance_amount: DataTypes.DECIMAL(10, 2),
        running_balance_currency: DataTypes.STRING,
      },
      { sequelize },
    );
  }

  static associate(models) {
    this.accountsAssociation = this.belongsTo(models.Accounts);
  }
}
