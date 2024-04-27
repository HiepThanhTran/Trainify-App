from django_seed import Seed

from schools.models import *

seeder = Seed.seeder()

seeder.add_entity(EducationalSystem, 5)
seeder.add_entity(Faculty, 5)
seeder.add_entity(Major, 5)
seeder.add_entity(AcademicYear, 5)
seeder.add_entity(Class, 5)
seeder.add_entity(Semester, 5)
