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
            'username' => 'quinhatpy',
            'email' => 'quinhatpy@gmail.com',
            'name' => 'Qui Nhat',
            'password' => bcrypt('1')
        ]);
    }
}
