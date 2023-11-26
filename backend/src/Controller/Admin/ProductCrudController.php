<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class ProductCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Product::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('name'),
            AssociationField::new('category')->hideOnIndex(),
            AssociationField::new('edition'),
            AssociationField::new('platform')->hideOnIndex(),
            AssociationField::new('genre')->hideOnIndex(),
            AssociationField::new('tag')->hideOnIndex(),
            BooleanField::new('isPhysical'),
            TextField::new('trailer')->hideOnIndex(),
            ImageField::new('img')->onlyOnIndex(),
            TextField::new('img')->onlyOnForms(),
            TextField::new('dev'),
            TextField::new('editor'),
            TextEditorField::new('description'),
            DateField::new('release'),
            NumberField::new('stock'),
            MoneyField::new('old_price')->setCurrency('EUR'),
            MoneyField::new('price')->setCurrency('EUR'),
        ];
    }
}
