# Training Point Management

This is the topic of training point management in my subject "Modern programming technologies" using Django RestAPI for Backend, and React Native for Frontend

## Installation

1 : Clone the project

```shell
git clone https://github.com/HiepThanhTran/Training-Point-Management.git
```

2 : Open project with pycharm

3 : Add venv for this project

```shell
python -m venv venv
```

4 : Download packages in requirements.txt file

```shell
pip install -r requirements.txt
```

5 : Create mysql database in your computer or use your database

6 : Change name, user, password of **DATABASES** variable in settings.py

7 : Run a data collection if you want sample data **(This may take a while)**

```shell
python manage.py collectdata
```
- This command also run makemigrations and migrate
- This command will create a superuser with:
  - **username**: admin@gmail.com
  - **password**: admin@123

- If you want to use your database, you can run makemigrations and migrate and create superuser

```shell
python manage.py makemigrations
python manage.py migrate

python manage.py createsuperuser
```

8 : Run project

```shell
python manage.py runserver
```

## Contributing

- [Trần Thanh Hiệp](https://github.com/hiepthanhtran)
- [Nguyễn Song Hậu](https://github.com/SongHau)

