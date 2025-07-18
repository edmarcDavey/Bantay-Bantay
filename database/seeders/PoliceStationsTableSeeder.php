<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PoliceStationsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('police_stations')->insert([
            [
                'name' => 'Baguio City Police Office – Police Station 1 (Naguilian)',
                'location' => 'CH6H+XPG, Naguilian Road, Baguio City',
                'contact' => '(074) 424 2697',
                'lat' => 16.4191,
                'lng' => 120.5736,
            ],
            [
                'name' => 'Baguio City Police Office – Police Station 2 (Camdas)',
                'location' => 'CHGV+6FR Under the Flyover, Magsaysay Ave, Baguio, Benguet, Philippines',
                'contact' => '(074) 661 1255',
                'lat' => 16.4205,
                'lng' => 120.6007,
            ],
            [
                'name' => 'Baguio City Police Office – Police Station 3 (Pacdal)',
                'location' => 'CH7J+7XG, Pacdal Circle, near Leonard Wood Road, Baguio City',
                'contact' => '(074) 424 0670',
                'lat' => 16.4187,
                'lng' => 120.6172,
            ],
            [
                'name' => 'Baguio City Police Office – Police Station 4 (Loakan)',
                'location' => 'CH7H+W2, Loakan Road, Baguio City',
                'contact' => '(074) 424 0992',
                'lat' => 16.3996,
                'lng' => 120.6132,
            ],
            [
                'name' => 'Baguio City Police Office – Police Station 5 (San Vicente)',
                'location' => 'CH6M+XJ, Palispis Highway, San Vicente, Baguio City',
                'contact' => '(074) 442 0629',
                'lat' => 16.4102,
                'lng' => 120.5707,
            ],
            [
                'name' => 'Baguio City Police Office – Police Station 6 (Aurora Hill)',
                'location' => 'CH7P+2V, Aurora Hill, Baguio City',
                'contact' => '(074) 424 2174',
                'lat' => 16.4262,
                'lng' => 120.6262,
            ],
            [
                'name' => 'Baguio City Police Office – Police Station 7 (CBD/Abanao)',
                'location' => 'CH6J+X2, Abanao Street, Baguio City',
                'contact' => '(074) 661 1489 / (074) 447 9805',
                'lat' => 16.4136,
                'lng' => 120.5952,
            ],
            [
                'name' => 'Baguio City Police Office – Police Station 8 (Kennon Road)',
                'location' => '9HRX+QX3, Kennon Road, Baguio City',
                'contact' => '0908 215 7790',
                'lat' => 16.3936,
                'lng' => 120.6017,
            ],
            [
                'name' => 'Baguio City Police Office – Police Station 9 (Irisan)',
                'location' => 'CH6W+9F, Purok 3, Irisan, Quirino National Highway, Baguio City',
                'contact' => '(074) 424 8834',
                'lat' => 16.4267,
                'lng' => 120.5537,
            ],
            [
                'name' => 'Baguio City Police Office – Police Station 10 (Marcos Highway)',
                'location' => 'CH6V+X9, Marcos Highway, Baguio City',
                'contact' => '(074) 422 2662',
                'lat' => 16.4082,
                'lng' => 120.5797,
            ],
        ]);
    }
}
