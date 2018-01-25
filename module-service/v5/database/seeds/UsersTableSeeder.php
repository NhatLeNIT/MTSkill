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
        \App\Models\User::insert([
            [
                'username'=> 'admin',
                'password' => bcrypt('123456'),
                'role' => 1
            ],
            [
                'username'=> 'user1',
                'password' => bcrypt('123456'),
                'role' => 0
            ],
            [
                'username'=> 'user2',
                'password' => bcrypt('123456'),
                'role' => 0
            ]
        ]);
    }
}
