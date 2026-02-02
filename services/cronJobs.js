const cron = require('node-cron');
const User = require('../models/User');
const Expense = require('../models/Expense');
const BankConnection = require('../models/BankConnection');
const emailService = require('../services/emailService');
const currencyService = require('../services/currencyService');
const InvoiceService = require('../services/invoiceService');
const ReminderService = require('../services/reminderService');

class CronJobs {
  static init() {
    // Process recurring expenses - Daily at 6 AM
    cron.schedule('0 6 * * *', async () => {
      console.log('[CronJobs] Processing recurring expenses...');
      await this.processRecurringExpenses();
    });

    // Send recurring expense reminders - Daily at 9 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('[CronJobs] Sending recurring expense reminders...');
      await this.sendRecurringReminders();
    });
    
    // Generate recurring invoices - Daily at 6 AM
    cron.schedule('0 6 * * *', async () => {
      console.log('[CronJobs] Generating recurring invoices...');
      await this.generateRecurringInvoices();
    });
    
    // Send payment reminders - Daily at 10 AM
    cron.schedule('0 10 * * *', async () => {
      console.log('[CronJobs] Sending payment reminders...');
      await this.sendPaymentReminders();
    });
    
    // Apply late fees - Daily at 12 AM (midnight)
    cron.schedule('0 0 * * *', async () => {
      console.log('[CronJobs] Applying late fees to overdue invoices...');
      await this.applyLateFees();
    });

    // Send subscription renewal reminders - Daily at 9:30 AM
    cron.schedule('30 9 * * *', async () => {
      console.log('[CronJobs] Sending subscription renewal reminders...');
      await this.sendSubscriptionReminders();
    });

    // Send trial ending reminders - Daily at 10 AM
    cron.schedule('0 10 * * *', async () => {
      console.log('[CronJobs] Sending trial ending reminders...');
      await this.sendTrialReminders();
    });

    // Process daily gamification updates - Daily at midnight
    cron.schedule('0 0 * * *', async () => {
      console.log('[CronJobs] Processing daily gamification updates...');
      await this.processDailyGamification();
    });

    // Weekly report - Every Sunday at 9 AM
    cron.schedule('0 9 * * 0', async () => {
      console.log('[CronJobs] Sending weekly reports...');
      await this.sendWeeklyReports();
    });

    // Monthly report - 1st day of month at 10 AM
    cron.schedule('0 10 1 * *', async () => {
      console.log('[CronJobs] Sending monthly reports...');
      await this.sendMonthlyReports();
    });

    // Reset monthly gamification points - 1st day of month at midnight
    cron.schedule('0 0 1 * *', async () => {
      console.log('[CronJobs] Resetting monthly gamification points...');
      await this.resetMonthlyGamification();
    });

    // Budget alerts - Daily at 8 PM
    cron.schedule('0 20 * * *', async () => {
      console.log('[CronJobs] Checking budget alerts...');
      await this.checkBudgetAlerts();
    });

    // Update exchange rates - Every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('Updating exchange rates...');
      await this.updateExchangeRates();
    });

    // Update portfolio prices - Every 15 minutes during market hours
    cron.schedule('*/15 9-16 * * 1-5', async () => {
      console.log('[CronJobs] Updating portfolio prices...');
      await this.updatePortfolioPrices();
    });

    // Daily portfolio metrics update - Daily at 5 PM
    cron.schedule('0 17 * * *', async () => {
      console.log('[CronJobs] Updating portfolio metrics...');
      await this.updateDailyPortfolioMetrics();
    });

    // Daily forecast generation - Daily at 6 AM
    cron.schedule('0 6 * * *', async () => {
      console.log('[CronJobs] Generating daily forecasts...');
      await this.generateDailyForecasts();
    });

    // Daily anomaly detection - Daily at 7 AM
    cron.schedule('0 7 * * *', async () => {
      console.log('[CronJobs] Running daily anomaly detection...');
      await this.runDailyAnomalyDetection();
    });

    // Forecast accuracy update - Daily at 11 PM
    cron.schedule('0 23 * * *', async () => {
      console.log('[CronJobs] Updating forecast accuracy...');
      await this.updateForecastAccuracy();
    });

    console.log('Cron jobs initialized successfully');
  }

  static async processRecurringExpenses() {
    try {
      await recurringService.processRecurringExpenses();
    } catch (error) {
      console.error('[CronJobs] Recurring expenses error:', error);
    }
  }

  static async sendRecurringReminders() {
    try {
      await recurringService.sendUpcomingReminders();
    } catch (error) {
      console.error('[CronJobs] Recurring reminders error:', error);
    }
  }

  static async sendSubscriptionReminders() {
    try {
      await subscriptionService.sendRenewalReminders();
    } catch (error) {
      console.error('[CronJobs] Subscription reminders error:', error);
    }
  }

  static async sendTrialReminders() {
    try {
      await subscriptionService.sendTrialReminders();
    } catch (error) {
      console.error('[CronJobs] Trial reminders error:', error);
    }
  }

  static async processDailyGamification() {
    try {
      await gamificationService.processDailyChallenges();
    } catch (error) {
      console.error('[CronJobs] Gamification processing error:', error);
    }
  }

  static async resetMonthlyGamification() {
    try {
      const UserGamification = require('../models/UserGamification');
      await UserGamification.updateMany(
        {},
        { 
          'points.currentMonth': 0,
          'points.lastMonthReset': new Date()
        }
      );
      console.log('[CronJobs] Monthly gamification points reset');
    } catch (error) {
      console.error('[CronJobs] Monthly reset error:', error);
    }
  }

  static async seedGamificationData() {
    try {
      await gamificationService.seedAchievements();
      await gamificationService.createSystemChallenges();
    } catch (error) {
      console.error('[CronJobs] Gamification seed error:', error);
    }
  }
  
  static async generateRecurringInvoices() {
    try {
      console.log('[CronJobs] Generating recurring invoices...');
      const result = await InvoiceService.generateRecurringInvoices();
      console.log(`[CronJobs] Generated ${result.count} recurring invoices`);
    } catch (error) {
      console.error('[CronJobs] Error generating recurring invoices:', error);
    }
  }
  
  static async sendPaymentReminders() {
    try {
      console.log('[CronJobs] Sending payment reminders...');
      const result = await ReminderService.processAllReminders();
      console.log(`[CronJobs] Sent ${result.success.length} reminders, ${result.failed.length} failed`);
    } catch (error) {
      console.error('[CronJobs] Error sending payment reminders:', error);
    }
  }
  
  static async applyLateFees() {
    try {
      console.log('[CronJobs] Applying late fees...');
      const User = require('../models/User');
      const users = await User.find({});
      
      let totalApplied = 0;
      for (const user of users) {
        try {
          const result = await InvoiceService.applyLateFees(user._id);
          totalApplied += result.count;
        } catch (error) {
          console.error(`[CronJobs] Error applying late fees for user ${user._id}:`, error);
        }
      }
      
      console.log(`[CronJobs] Applied late fees to ${totalApplied} invoices`);
    } catch (error) {
      console.error('[CronJobs] Error applying late fees:', error);
    }
  }

  static async updateExchangeRates() {
    try {
      // Update rates for major base currencies
      const baseCurrencies = ['USD', 'EUR', 'GBP', 'INR'];

      for (const currency of baseCurrencies) {
        try {
          await currencyService.updateExchangeRates(currency);
          console.log(`Updated exchange rates for ${currency}`);
        } catch (error) {
          console.error(`Failed to update rates for ${currency}:`, error.message);
        }
      }

      console.log('Exchange rates update completed');
    } catch (error) {
      console.error('Exchange rates update error:', error);
    }
  }

  static async sendWeeklyReports() {
    try {
      const users = await User.find({});
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      for (const user of users) {
        const weeklyExpenses = await Expense.aggregate([
          {
            $match: {
              user: user._id,
              date: { $gte: oneWeekAgo },
              type: 'expense'
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
              amount: { $sum: '$amount' }
            }
          },
          { $sort: { _id: 1 } }
        ]);

        const totalSpent = weeklyExpenses.reduce((sum, day) => sum + day.amount, 0);
        const avgDaily = totalSpent / 7;

        const reportData = {
          weeklyExpenses: weeklyExpenses.map(day => ({
            date: day._id,
            amount: day.amount
          })),
          totalSpent,
          avgDaily
        };

        await emailService.sendWeeklyReport(user, reportData);
      }
    } catch (error) {
      console.error('Weekly report error:', error);
    }
  }

  static async sendMonthlyReports() {
    try {
      const users = await User.find({});
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      for (const user of users) {
        const monthlyData = await Expense.aggregate([
          {
            $match: {
              user: user._id,
              date: { $gte: startOfMonth }
            }
          },
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' }
            }
          }
        ]);

        const categoryData = await Expense.aggregate([
          {
            $match: {
              user: user._id,
              date: { $gte: startOfMonth },
              type: 'expense'
            }
          },
          {
            $group: {
              _id: '$category',
              amount: { $sum: '$amount' }
            }
          },
          { $sort: { amount: -1 } },
          { $limit: 5 }
        ]);

        const totalExpenses = monthlyData.find(d => d._id === 'expense')?.total || 0;
        const totalIncome = monthlyData.find(d => d._id === 'income')?.total || 0;
        const balance = totalIncome - totalExpenses;

        const reportData = {
          totalExpenses,
          totalIncome,
          balance,
          topCategories: categoryData.map(cat => ({
            name: cat._id,
            amount: cat.amount
          }))
        };

        await emailService.sendMonthlyReport(user, reportData);
      }
    } catch (error) {
      console.error('Monthly report error:', error);
    }
  }

  static async checkBudgetAlerts() {
    try {
      // This would require a Budget model - simplified version
      const users = await User.find({});
      const startOfMonth = new Date();
      startOfMonth.setDate(1);

      for (const user of users) {
        const categorySpending = await Expense.aggregate([
          {
            $match: {
              user: user._id,
              date: { $gte: startOfMonth },
              type: 'expense'
            }
          },
          {
            $group: {
              _id: '$category',
              spent: { $sum: '$amount' }
            }
          }
        ]);

        // Example budget limits (in real app, this would come from Budget model)
        const budgetLimits = {
          food: 10000,
          transport: 5000,
          entertainment: 3000,
          shopping: 8000
        };

        for (const category of categorySpending) {
          const budget = budgetLimits[category._id];
          if (budget && category.spent > budget * 0.8) { // 80% threshold
            await emailService.sendBudgetAlert(
              user,
              category._id,
              category.spent,
              budget
            );
          }
        }
      }
    } catch (error) {
      console.error('Budget alert error:', error);
    }
  }

  static async generateDailyForecasts() {
    try {
      const budgetForecastingService = require('./budgetForecastingService');
      const users = await User.find({});

      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          // Generate monthly forecast for all categories
          await budgetForecastingService.generateForecast(user._id, {
            periodType: 'monthly',
            algorithm: 'moving_average',
            confidenceLevel: 95
          });

          // Generate category-specific forecasts for top spending categories
          const topCategories = await this.getTopSpendingCategories(user._id);
          for (const category of topCategories.slice(0, 3)) {
            await budgetForecastingService.generateForecast(user._id, {
              periodType: 'monthly',
              category: category,
              algorithm: 'linear_regression',
              confidenceLevel: 95
            });
          }

          successCount++;
        } catch (error) {
          console.error(`[CronJobs] Error generating forecast for user ${user._id}:`, error.message);
          errorCount++;
        }
      }

      console.log(`[CronJobs] Generated forecasts for ${successCount} users, ${errorCount} errors`);
    } catch (error) {
      console.error('[CronJobs] Error in daily forecast generation:', error);
    }
  }

  static async runDailyAnomalyDetection() {
    try {
      const anomalyDetectionService = require('./anomalyDetectionService');
      const users = await User.find({});

      let totalAnomalies = 0;
      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          const result = await anomalyDetectionService.detectAnomalies(user._id, {
            lookbackDays: 30,
            sensitivityLevel: 'medium'
          });

          totalAnomalies += result.detected || 0;
          successCount++;
        } catch (error) {
          console.error(`[CronJobs] Error detecting anomalies for user ${user._id}:`, error.message);
          errorCount++;
        }
      }

      console.log(`[CronJobs] Detected ${totalAnomalies} anomalies for ${successCount} users, ${errorCount} errors`);
    } catch (error) {
      console.error('[CronJobs] Error in daily anomaly detection:', error);
    }
  }

  static async updateForecastAccuracy() {
    try {
      const budgetForecastingService = require('./budgetForecastingService');
      const users = await User.find({});

      let updatedCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          const result = await budgetForecastingService.updateForecastAccuracy(user._id);
          updatedCount += result.updated_count || 0;
        } catch (error) {
          console.error(`[CronJobs] Error updating accuracy for user ${user._id}:`, error.message);
          errorCount++;
        }
      }

      console.log(`[CronJobs] Updated accuracy for ${updatedCount} forecasts, ${errorCount} errors`);
    } catch (error) {
      console.error('[CronJobs] Error in forecast accuracy update:', error);
    }
  }

  static async getTopSpendingCategories(userId) {
    try {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const categoryData = await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: threeMonthsAgo },
            type: 'expense'
          }
        },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' }
          }
        },
        {
          $sort: { total: -1 }
        },
        {
          $limit: 5
        }
      ]);

      return categoryData.map(cat => cat._id);
    } catch (error) {
      console.error('[CronJobs] Error getting top spending categories:', error);
      return [];
    }
  }
}

module.exports = CronJobs;
