from django_seed import Seed

from schools.models import *

seeder = Seed.seeder()

seeder.add_entity(EducationalSystem, 5)
