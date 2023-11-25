<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class ProductCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Product::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name'),
            AssociationField::new('category'),
            AssociationField::new('edition'),
            AssociationField::new('platform'),
            AssociationField::new('genre'),
            AssociationField::new('tag'),
            TextField::new('trailer'),
            TextField::new('img'),
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
