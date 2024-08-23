# Guesthouse Management System

![image](https://github.com/user-attachments/assets/5f529944-a928-4744-b778-7d03f7a911c7)


This project is a web-based Guesthouse Management System designed to streamline the process of managing guesthouses. It includes functionalities such as user authentication, admin authentication,  guest house booking system etc.

## Features
- **Admin Authentication**: Secure login and registration with JWT-based authentication.
- **User Authentication**: Secure login and registration with Clerk authentication.
- **Admin Dashboard**: Admins can view and manage bookings, cabins through an intuitive dashboard, with capabilities to add, edit and delete entries.
- **Guesthouse Management**: Easily manage guesthouse details like rooms, availability, and pricing.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
- **RESTful API**: Built with Django Rest Framework for robust backend operations.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/guesthouse-management.git
    ```

2. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3. **Apply migrations**:
    ```bash
    python manage.py migrate
    ```

4. **Run the development server**:
    ```bash
    python manage.py runserver
    ```

5. **Frontend Setup**:
    - Ensure that your frontend Next js is set up and running on `http://localhost:3000`.


## Usage

- **Admin Settings**: The admin can update the username and password using the provided form.
- **Guesthouse Management**: Administrators can manage rooms, update availability, and set pricing.
- **Image Management**: Images are managed via a separate API, allowing for easy updates and maintenance.

## Technologies Used

- **Backend**: Django, Django Rest Framework, Simple JWT
- **Frontend**: Next js 14, Tailwind CSS, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT Authentication, Clerk Authentication
- **Other**: Shadcn UI, FaIcons

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
