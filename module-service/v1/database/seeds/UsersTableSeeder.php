<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::insert(
            [
                [
                    'name' => 'Nhat Le',
                    'email' => 'quinhatpy@gmail.com',
                    'username' => 'quinhatpy',
                    'password' => bcrypt('123456'),
                    'created_at' => new DateTime()
                ],
                [
                    'name' => 'Nhat Le',
                    'email' => 'nhatle.nit@gmail.com',
                    'username' => 'nhatle',
                    'password' => bcrypt('123456'),
                    'created_at' => new DateTime()
                ]
            ]
        );
    }
}
