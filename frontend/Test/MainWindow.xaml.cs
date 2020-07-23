using System;
using System.Windows;
using System.Windows.Controls;
using MySql.Data.MySqlClient;

namespace Test
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            int brisbane_bar_value = 0;
            int southport_value = 0;
            int mooloolaba_value = 0;

            if (string.IsNullOrWhiteSpace(first_name_form.Text) || string.IsNullOrWhiteSpace(last_name_form.Text) || string.IsNullOrWhiteSpace(email_form.Text))
            {
                MessageBox.Show("Please fill all boxes.");
               return;
            };

            if (!(bool)(brisbane_bar_box.IsChecked) && !(bool)(southport_box.IsChecked) && !(bool)(mooloolaba_box.IsChecked)){
                MessageBox.Show("Please tick a tide site box.");
                return;
            };

            if ((bool)(brisbane_bar_box.IsChecked))
            {
                brisbane_bar_value = 1;
            };

            if ((bool)(southport_box.IsChecked))
            {
                southport_value = 1;
            };

            if ((bool)(mooloolaba_box.IsChecked))
            {
                mooloolaba_value = 1;
            };

            try
            {
                Convert.ToDouble(phone_number_form.Text);
            }
            catch
            {
                MessageBox.Show("Please enter a correct phone number");
                return;
            };

            string connection_string = "server=localhost; database=sea_the_tide;uid=root;password=password;";
            MySqlConnection db_connection;
            db_connection = new MySqlConnection(connection_string);
            try
            {
                db_connection.Open();
            }
            catch (System.Exception ex)
            {
                MessageBox.Show("Database error\n" + ex.Message);
                return;
            }

            MySqlCommand cmd = new MySqlCommand();
            cmd.Connection = db_connection;
            cmd.CommandText = "INSERT INTO user_data(last_name, first_name, email, phone_number, brisbane_bar_value, southport_value, mooloolaba_value)" +
                " VALUES (@last_name, @first_name, @email, @phone_number, @brisbane_bar_value, @southport_value, @mooloolaba_value)";
            cmd.Prepare();

            var cmd_param = cmd.Parameters;
            cmd_param.AddWithValue("last_name", last_name_form.Text);
            cmd_param.AddWithValue("first_name", first_name_form.Text);
            cmd_param.AddWithValue("email", email_form.Text);
            cmd_param.AddWithValue("brisbane_bar_value", brisbane_bar_value);
            cmd_param.AddWithValue("southport_value", southport_value);
            cmd_param.AddWithValue("mooloolaba_value", mooloolaba_value);
            cmd_param.AddWithValue("phone_number", phone_number_form.Text);

            try
            {
                cmd.ExecuteNonQuery();
                MessageBox.Show("User info successfully added to database");
            }
            catch (System.Exception ex)
            {
                MessageBox.Show("Database error. Please try again later. " + ex.Message);
                return;
            }

            db_connection.Close();



        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            var help_window = new Window3();
            help_window.Show();
        }
    }
}